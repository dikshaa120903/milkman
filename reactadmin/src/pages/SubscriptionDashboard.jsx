import React, { useEffect, useState } from 'react';
import SubscribeModal from '../components/SubscribeModal';

const getSubscriptions = () => JSON.parse(localStorage.getItem('subscriptions') || '[]');
const saveSubscriptions = (arr) => localStorage.setItem('subscriptions', JSON.stringify(arr));

function datePlusDays(d, n){ const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt; }
function dateToYMD(d){ const dt = new Date(d); return dt.toISOString().slice(0,10); }

const weekdayName = (jsDay)=>{
  const map = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return map[jsDay];
}

// compute next N upcoming delivery dates for a subscription (simple algorithm)
const getUpcomingDeliveries = (sub, count=5) => {
  const results = [];
  if (sub.paused) return results;
  const start = sub.startDate ? new Date(sub.startDate + 'T00:00:00') : new Date();
  const today = new Date();
  let cursor = start > today ? new Date(start) : new Date(today);
  let tries = 0;
  while (results.length < count && tries < 400) {
    const ymd = dateToYMD(cursor);
    // skip if in skipDates
    if ((sub.skipDates || []).indexOf(ymd) === -1) {
      let match = false;
      const freq = sub.frequency;
      if (freq === 'Daily') match = true;
      else if (freq === 'Alternate Days') {
        const base = new Date(sub.startDate || dateToYMD(today));
        const diff = Math.floor((cursor - base)/(1000*60*60*24));
        match = (diff % 2) === 0;
      } else if (freq === 'Weekly') {
        const startDay = new Date(sub.startDate || dateToYMD(today)).getDay();
        match = cursor.getDay() === startDay;
      } else if (freq === 'Monthly') {
        const startDateNum = new Date(sub.startDate || dateToYMD(today)).getDate();
        match = cursor.getDate() === startDateNum;
      } else if (freq === 'Custom Days') {
        const names = (sub.customDays||[]);
        const cname = weekdayName(cursor.getDay());
        match = names.includes(cname);
      } else if (freq === 'Date Range') {
        const end = sub.endDate ? new Date(sub.endDate+'T23:59:59') : null;
        const afterStart = cursor >= new Date((sub.startDate||dateToYMD(today))+'T00:00:00');
        const beforeEnd = !end || cursor <= end;
        match = afterStart && beforeEnd;
      }

      if (match) {
        // ensure within endDate when provided
        if (sub.endDate) {
          const end = new Date(sub.endDate+'T23:59:59');
          if (cursor > end) break;
        }
        if (cursor >= today) results.push(ymd);
      }
    }
    cursor = datePlusDays(cursor, 1);
    tries++;
  }
  return results;
}

const SubscriptionDashboard = () => {
  const [subs, setSubs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(()=>{
    setSubs(getSubscriptions());
  }, []);

  const refresh = () => setSubs(getSubscriptions());

  const togglePause = (id) => {
    const updated = subs.map(s => s.id === id ? { ...s, paused: !s.paused } : s);
    saveSubscriptions(updated);
    setSubs(updated);
  };

  const changeQty = (id, delta) => {
    const updated = subs.map(s => s.id === id ? { ...s, quantity: Math.max(1, (s.quantity||1)+delta) } : s);
    saveSubscriptions(updated);
    setSubs(updated);
  };

  const cancel = (id) => {
    const updated = subs.filter(s=>s.id!==id);
    saveSubscriptions(updated);
    setSubs(updated);
  };

  const editSub = (sub) => {
    setEditing(sub);
    setShowModal(true);
  };

  const onSaved = (updatedSub) => {
    // refresh list from storage
    refresh();
  };

  const downloadInvoice = (s) => {
    const lines = [];
    lines.push('Invoice for subscription id: ' + s.id);
    lines.push('Product: ' + s.productName);
    lines.push('Quantity: ' + s.quantity);
    lines.push('Frequency: ' + s.frequency);
    lines.push('Start: ' + s.startDate);
    lines.push('Billing: ' + s.billingMethod);
    lines.push('Amount per delivery: ₹' + (s.quantity * (s.unitPrice||0)));
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_sub_${s.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4">
      <h2>My Subscriptions</h2>
      <SubscribeModal show={showModal} onClose={()=>{setShowModal(false); setEditing(null);}} product={editing?{name:editing.productName,img:editing.productImg}:null} initialData={editing} onSaved={onSaved} />
      {subs.length === 0 ? (
        <p>No active subscriptions. Visit categories to subscribe.</p>
      ) : (
        <div className="row mt-3">
          {subs.map(s => (
            <div className="col-md-6 mb-3" key={s.id}>
              <div className="card shadow-sm">
                <div className="card-body d-flex">
                  <img src={s.productImg} alt={s.productName} style={{width:100, height:80, objectFit:'cover', marginRight:12}} />
                  <div style={{flex:1}}>
                    <h6>{s.productName}</h6>
                    <div className="text-muted">Qty: {s.quantity} • {s.frequency} • {s.deliveryWindow}</div>
                    <div className="mt-2">
                      <strong>Upcoming:</strong>
                      <div>
                        {getUpcomingDeliveries(s,5).length === 0 ? <small className="text-muted">No upcoming deliveries</small> : (
                          <ul className="mb-0">
                            {getUpcomingDeliveries(s,5).map(d=> <li key={d}><small>{d}</small></li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                    {s.skipDates && s.skipDates.length > 0 && (
                      <div className="mt-1">
                        <small className="text-danger">Skipped: {s.skipDates.join(', ')}</small>
                      </div>
                    )}
                    <div className="mt-3 d-flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-outline-secondary" onClick={()=>changeQty(s.id, 1)}>+ Qty</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={()=>changeQty(s.id, -1)}>- Qty</button>
                      <button className={`btn btn-sm ${s.paused? 'btn-success':'btn-warning'}`} onClick={()=>togglePause(s.id)}>{s.paused? 'Resume':'Pause'}</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>cancel(s.id)}>Cancel</button>
                      <button className="btn btn-sm btn-outline-primary" onClick={()=>downloadInvoice(s)}>Download Invoice</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={()=>editSub(s)}>Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionDashboard;

import React, { useState, useEffect } from 'react';

const frequencyOptions = [
  'Daily',
  'Alternate Days',
  'Weekly',
  'Monthly',
  'Custom Days',
  'Date Range'
];

const weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat'];

const SubscribeModal = ({ show, onClose, product, initialData, onSaved }) => {
  const [qty, setQty] = useState(1);
  const [frequency, setFrequency] = useState('Daily');
  const [customDays, setCustomDays] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [skipDates, setSkipDates] = useState([]);
  const [deliveryWindow, setDeliveryWindow] = useState('Morning');
  const [address, setAddress] = useState('Home');
  const [notes, setNotes] = useState('');
  const [billingMethod, setBillingMethod] = useState('Monthly');
  const [autoDeduct, setAutoDeduct] = useState(false);
  const [prodIdMap, setProdIdMap] = useState({}); // name->id cache
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      // if editing, populate with initialData
      if (initialData) {
        setQty(initialData.quantity || 1);
        setFrequency(initialData.frequency || 'Daily');
        setCustomDays(initialData.customDays || []);
        setStartDate(initialData.startDate || '');
        setEndDate(initialData.endDate || '');
        setSkipDates(initialData.skipDates || []);
        setDeliveryWindow(initialData.deliveryWindow || 'Morning');
        setAddress(initialData.address || 'Home');
        setNotes(initialData.notes || '');
        setBillingMethod(initialData.billingMethod || 'Monthly');
        setAutoDeduct(initialData.autoDeduct || false);
      } else {
        setQty(1);
        setFrequency('Daily');
        setCustomDays([]);
        setStartDate('');
        setEndDate('');
        setSkipDates([]);
        setDeliveryWindow('Morning');
        setAddress('Home');
        setNotes('');
        setBillingMethod('Monthly');
        setAutoDeduct(false);
      }
    }
  }, [product, show, initialData]);

  if (!show || !product) return null;

  const toggleCustomDay = (d) => {
    setCustomDays(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]);
  };

  const addSkipDate = (d) => {
    if (!d) return;
    setSkipDates(prev => Array.from(new Set([...prev, d])));
  };

  const removeSkipDate = (d) => setSkipDates(prev => prev.filter(x=>x!==d));

  const save = async () => {
    setSaving(true);
    // determine id and object
    const isEdit = !!(initialData && initialData.id);
    const id = isEdit ? initialData.id : Date.now();
    const subsObj = {
      id,
      productName: product.name,
      productImg: product.img,
      unitPrice: product.price || (initialData && initialData.unitPrice) || 0,
      quantity: Number(qty),
      frequency,
      customDays,
      startDate: startDate || new Date().toISOString().slice(0,10),
      endDate: endDate || null,
      skipDates,
      deliveryWindow,
      address,
      notes,
      billingMethod,
      autoDeduct,
      paused: isEdit ? initialData.paused : false,
      createdAt: isEdit ? initialData.createdAt : new Date().toISOString()
    };

    // persist locally
    try {
      const existing = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      if (isEdit) {
        const idx = existing.findIndex(s=>s.id===id);
        if (idx !== -1) existing[idx] = subsObj;
      } else {
        existing.push(subsObj);
      }
      localStorage.setItem('subscriptions', JSON.stringify(existing));
      onSaved && onSaved(subsObj);
    } catch (err) {
      console.error('save subscription', err);
    }

    // attempt backend sync
    try {
      // build payload minimal for API
      let productId = prodIdMap[product.name];
      if (!productId && !loadingProducts) {
        setLoadingProducts(true);
        const resp = await import('../services/api').then(m=>m.default.get('/product/product/'));
        const data = resp.data;
        const map = {};
        data.forEach(p=> map[p.name] = p.id);
        setProdIdMap(map);
        productId = map[product.name];
        setLoadingProducts(false);
      }
      const payload = {
        customer: JSON.parse(localStorage.getItem('customerUser') || '{}').id || null,
        product: productId || 0,
        quantity: qty,
        start_date: subsObj.startDate,
        is_active: !subsObj.paused
      };
      if (isEdit) {
        await import('../services/api').then(m=>m.default.put(`/subscription/subscription/${id}/`, payload));
      } else {
        await import('../services/api').then(m=>m.default.post('/subscription/subscription/', payload));
      }
    } catch (err) {
      console.error('backend sync failed', err);
    }

    setSaving(false);
    onClose && onClose();
  };

  return (
    <div style={{position:'fixed', left:0, top:0, right:0, bottom:0, background:'rgba(0,0,0,0.4)', zIndex:2100}}>
      <div style={{maxWidth:720, margin:'40px auto', background:'#fff', borderRadius:8, padding:20}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Subscribe: {product.name}</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>Close</button>
        </div>

        <div className="row">
          <div className="col-md-4 mb-2">
            <label className="form-label">Quantity</label>
            <div className="input-group">
              <button className="btn btn-outline-secondary" onClick={()=>setQty(q=>Math.max(1, q-1))}>-</button>
              <input type="number" className="form-control" value={qty} onChange={e=>setQty(Number(e.target.value)||1)} />
              <button className="btn btn-outline-secondary" onClick={()=>setQty(q=>q+1)}>+</button>
            </div>
          </div>

          <div className="col-md-8 mb-2">
            <label className="form-label">Frequency</label>
            <select className="form-select" value={frequency} onChange={e=>setFrequency(e.target.value)}>
              {frequencyOptions.map(f=> <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {frequency === 'Custom Days' && (
            <div className="col-12 mb-2">
              <label className="form-label">Select Days (Mon–Sat)</label>
              <div className="d-flex gap-2">
                {weekdays.map(d=> (
                  <button key={d} type="button" className={`btn btn-sm ${customDays.includes(d)?'btn-primary':'btn-outline-secondary'}`} onClick={()=>toggleCustomDay(d)}>{d}</button>
                ))}
              </div>
            </div>
          )}

          {frequency === 'Date Range' && (
            <>
              <div className="col-md-6 mb-2">
                <label className="form-label">Start Date</label>
                <input className="form-control" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">End Date (optional)</label>
                <input className="form-control" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
              </div>
            </>
          )}

          <div className="col-md-6 mb-2">
            <label className="form-label">Delivery Window</label>
            <select className="form-select" value={deliveryWindow} onChange={e=>setDeliveryWindow(e.target.value)}>
              <option>Morning</option>
              <option>Evening</option>
            </select>
          </div>

          <div className="col-md-6 mb-2">
            <label className="form-label">Address</label>
            <input className="form-control" value={address} onChange={e=>setAddress(e.target.value)} />
          </div>

          <div className="col-md-6 mb-2">
            <label className="form-label">Skip specific dates</label>
            <div className="d-flex align-items-center">
              <input type="date" className="form-control me-2" id="skipDateInput" />
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => {
                  const el = document.getElementById('skipDateInput');
                  if (el && el.value) { addSkipDate(el.value); el.value = ''; }
              }}>Add</button>
            </div>
            {skipDates.length > 0 && (
              <ul className="small mt-1">
                {skipDates.map(d=> (
                  <li key={d} className="d-flex justify-content-between align-items-center">
                    {d}
                    <button type="button" className="btn btn-link btn-sm text-danger" onClick={() => removeSkipDate(d)}>x</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-12 mb-2">
            <label className="form-label">Delivery Notes</label>
            <textarea className="form-control" rows={2} value={notes} onChange={e=>setNotes(e.target.value)} />
          </div>

          <div className="col-md-6 mb-2">
            <label className="form-label">Billing</label>
            <select className="form-select" value={billingMethod} onChange={e=>setBillingMethod(e.target.value)}>
              <option>Monthly</option>
              <option>Pay-per-delivery</option>
            </select>
          </div>

          <div className="col-md-6 mb-2 d-flex align-items-center">
            <label className="form-check-label me-2">Auto-deduct wallet</label>
            <input type="checkbox" className="form-check-input" checked={autoDeduct} onChange={e=>setAutoDeduct(e.target.checked)} />
          </div>

          <div className="col-12 mt-3 d-flex justify-content-end">
            <button className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>Save Subscription</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;

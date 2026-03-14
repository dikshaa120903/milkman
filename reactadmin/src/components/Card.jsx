import React from 'react';
import './Card.css';

const Card = ({
  children,
  className = '',
  shadow = 'md',
  radius = 'lg',
  padding = 'lg',
  hover = false,
  onClick
}) => {
  const cardClasses = [
    'card',
    `card-shadow-${shadow}`,
    `card-radius-${radius}`,
    `card-padding-${padding}`,
    hover ? 'card-hover' : '',
    onClick ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
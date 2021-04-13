import React from 'react';
export interface CardProps {
    id: any;
    index: number;
    move?: (dragIndex: number, hoverIndex: number) => void;
    end: (id: string, dragIndex: number) => void;
}
declare const Card: React.FC<CardProps>;
export default Card;

import React from 'react';
import Draggable from 'react-draggable';
import HandParamsForm from './HandParamsForm';
import GaussianGraph from './GaussianGraph';
const DraggableSquare = () => {
    return (
        <Draggable>
            <div
                style={{
                    width: '500px',
                    height: '500px',
                    background: 'white',
                    border: '4px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'move',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Thay thế nội dung */}
                <HandParamsForm
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />

            </div>
        </Draggable>
    );
};

export default DraggableSquare;

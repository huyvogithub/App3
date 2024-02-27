import React from 'react';

const EmbeddedDashboard = () => {
    return (
        <div>
            <iframe
                title="MongoDB Dashboard"
                width="100%"
                height="3400"
                src="https://charts.mongodb.com/charts-node-red-to-mongodb-wjptb/public/dashboards/a0bfcd45-a084-4d34-b4a3-1d75f624f1cb"
                frameBorder="0"
            ></iframe>
        </div>
    );
};

export default EmbeddedDashboard;

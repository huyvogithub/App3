import React from 'react';

const EmbeddedDashboard = () => {
    return (
        <div>
            <iframe
                title="MongoDB Dashboard"
                width="100%"
                height="3400"
                src="https://charts.mongodb.com/charts-project-0-kfmbw/public/dashboards/65900554-51ea-4208-8f3a-80f628974b08"
                frameBorder="0"
            ></iframe>
        </div>
    );
};

export default EmbeddedDashboard;

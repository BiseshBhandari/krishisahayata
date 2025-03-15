// import React, { useEffect, useState } from "react";
// import { use } from "react";
// import { useParams, useSearchParams } from "react-router";
// import('../Styles/PaymentSuccess.css');

// function PaymentSuccess() {
//     const { order_id } = useParams();
//     const [searchParams] = useSearchParams();
//     const dataquery = searchParams.get("data");
//     const [data, setData] = useState({});

//     useEffect(() => {
//         const resdata = atob(dataquery);
//         const resObject = JSON.parse(resdata);
//         setData(resObject);
//         console.log(resObject);
//     }, [searchParams]);

//     return (
//         <div className="payment-success_container">
//             <h1>Payment Success</h1>
//             <h2>Paid with esewa</h2>
//         </div>
//     );
// };

// export default PaymentSuccess;

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"; // Use correct import
import '../Styles/PaymentSuccess.css';

function PaymentSuccess() {
    const { order_id } = useParams()
    const [searchParams] = useSearchParams();
    const dataquery = searchParams.get("data"); // Retrieve the query parameter
    const [data, setData] = useState({});

    useEffect(() => {
        // Check if dataquery is present
        if (!dataquery) {
            console.error("No dataquery parameter found in URL");
            return;
        }

        try {
            const resdata = atob(dataquery); // Decode base64 string
            const resObject = JSON.parse(resdata); // Parse the JSON object
            setData(resObject); // Update the state with the parsed object
            console.log(resObject); // Log the data for debugging
        } catch (error) {
            console.error("Error parsing dataquery:", error); // Catch and log any parsing errors
        }
    }, [dataquery]); // Only run this effect when dataquery changes

    return (
        <div className="payment-success_container">
            <h1>Payment Success</h1>
            <h2>Paid with esewa</h2>
            {data && data.transaction_uuid ? (
                <div>
                    <h3>Order ID: {order_id}</h3>
                    <p>Transaction UUID: {data.transaction_uuid}</p>
                    <p>Total Amount: {data.total_amount}</p>
                    {/* You can display more details based on the data object */}
                </div>
            ) : (
                <p>Loading payment details...</p>
            )}
        </div>
    );
}

export default PaymentSuccess;

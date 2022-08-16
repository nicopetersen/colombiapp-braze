import moment from "moment";
import { useEffect, useState } from "react";

export const Clock = () => {
    const [remaining, setRemaining] = useState(
        moment.duration(
            moment(new Date(2022, 11, 29, 6)).diff(moment(), "seconds"),
            "seconds"
        )
    );
    useEffect(() => {
        setInterval(() => {
            setRemaining(
                moment.duration(
                    moment(new Date(2022, 11, 29, 6)).diff(moment(), "seconds"),
                    "seconds"
                )
            );
        }, 1000);
    }, []);
    return (
        <div
            className="flex items-center flex-col justify-center p-4 text-center m-4 rounded-md"
            style={{ boxShadow: "0 0 4px lightgray" }}
        >
            <div className="flex items-center">
                <h3 className="ml-2 text-xl mb-0">
                    {remaining.months()} meses
                </h3>
                <h3 className="ml-2 text-xl mb-0">{remaining.days()} días</h3>
                <h3 className="ml-2 text-xl mb-0">{remaining.hours()} horas</h3>
                <h3 className="ml-2 text-xl mb-0">
                    {remaining.minutes()} min.
                </h3>
                <h3 className="ml-2 text-xl mb-0">
                    {remaining.seconds()} seg.
                </h3>
            </div>
        </div>
    );
};

import "@immfly/flights-map";
import { useEffect } from "react";
import { useState } from "react";
import { DOMAttributes } from "react";
type CustomElement<T> = Partial<T & DOMAttributes<T> & any>;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["flights-map"]: CustomElement<{}>;
        }
    }
}
const config = {
    colors: {
        land: "#BDBDBD", // Specifies the colors of the land.
        background: "#ffffff", // Specifies the color of the map background.
        aircrafts: "#000000", // Specifies a global color for aircrafts wich flight has no color.
        lines: "#000000", // Specifies a global color for lines wich flight has no color.
        cities: "#000000", // Specifies a global color for cities wich flight has no color.
    },
    zoomedContinent: "south_america", // Specifies default bounding boxes to initialize the map. You can use 'europe', 'asia', 'oceania', 'africa', 'north_america' or 'south_america'.
};

export const Map = () => {
    const [state, setState] = useState(false);
    useEffect(() => {
        setState(true);
    }, []);
    const flights = [
        {
            name: "V131",
            origin: {
                city: "Buenos Aires",
                latitude: -34.597093,
                longitude: -58.431248,
            },
            destination: {
                city: "Cartagena",
                latitude: 10.401677,
                longitude: -75.487886,
            },
            state: 0,
            color: "#F60",
        },
    ];
    return (
        <div className="h-48 w-full">
            {state ? "" : "Loading"}
            <flights-map
                flightsMapLoaded={() => {
                    console.log(`Loaded map`);
                    setState(true);
                }}
                ref={(el: any) => {
                    if (el) {
                        el.flights = flights;
                        el.config = { ...config, forceUpdate: state };
                    }
                }}
            />
        </div>
    );
};

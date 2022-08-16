export const Gallery = () => {
    const videos = ["xzy4umDtA88", "vPJS2moVUFA", "gntgrVvB5ls", "mTJeNcRhFMo"];
    return (
        <div className="flex items-center overflow-x-scroll">
            {videos.map((id) => (
                <div
                    key={id}
                    className="shadow-md rounded-md h-48 w-48 mr-4 shrink-0"
                >
                    <iframe
                        width="100%"
                        height="100%"
                        className="rounded-md"
                        src={`https://www.youtube.com/embed/${id}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            ))}
        </div>
    );
};

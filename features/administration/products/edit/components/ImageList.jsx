export function ImageList({imgList, className}) {
    return (
        <ul className={className}>
            {imgList && imgList.map( img =>
                <li key={img}>
                    <img src={`/images/${img}`} />
                </li>)}
        </ul>
    );
}

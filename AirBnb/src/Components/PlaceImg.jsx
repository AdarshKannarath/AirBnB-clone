export default function PlaceImg({ place,index=0, className = null }) {
    console.log(place)
    if (!place.photos?.length) {
        return '';
    }
    if (!className) {
        className = 'object-cover object-top w-full h-full';
    }
    return (
        <img className={className} src={'http://localhost:4000/uploads/'+place.photos[index]} alt="" />
    );
}
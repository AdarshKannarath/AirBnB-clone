import Image from "./Image";

export default function PlaceImg({ place,index=0, className = null }) {
    console.log(place)
    if (!place.photos?.length) {
        return '';
    }
    if (!className) {
        className = 'object-cover object-top w-full h-full';
    }
    return (
        <Image className={className} src={place.photos[index]} alt="" />
    );
}
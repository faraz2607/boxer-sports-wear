import { useState } from "react"
import { catalogImages } from "../../common/constants"

const Catalogue = () => {
    const [visibleItems, setVisibleItems] = useState(7);

  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 10);
  }
    return (
        <div className="py-4 md:py-8">
            <h2 id="catalogue" className="text-xl md:text-4xl font-bold mb-2 md:mb-4">Catalogue</h2>
        <p className="text-gray-700 text-md md:text-lg mb-2 md:mb-4">Discover a diverse range of cards in our catalogue, offering vibrant designs and timeless classics to convey heartfelt messages and celebrate special moments.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 ">
            {catalogImages.slice(0, visibleItems).map((item)=> {
                return <img className="rounded-2xl" src={item.imgSrc} alt={item.imgName} />
            })}
            {visibleItems < catalogImages.length &&
            <button onClick={loadMoreItems} className="bg-dark-15 h-10 m-auto items-center text-green-15 py-2 px-6 rounded-full font-bold hover:bg-dark-35 transition duration-300">
                See More
            </button>}
        </div>
        {visibleItems >= catalogImages.length && <div className="h-24 md:h-28 w-72 mt-4 md:mt-8 mx-auto flex px-4 items-center rounded-full bg-green-35 text-white shadow-lg">
  <p className="text-center text-md md:text-lg">
    All items have been loaded. Stay tuned for more exciting additions in the future!
  </p>
</div>
}
        </div>
    )
}

export default Catalogue;
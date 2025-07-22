import type {BookData} from "../../../model/BookData.ts";


type BookProps = {
    book: BookData
}

const images: Record<string, string> = import.meta.glob(`../../../assets/bookCovers/*`,{eager: true, import: 'default'});
export function Book({book}: BookProps) {

    const getConditionColor = (condition: string) => {
        switch (condition.toLowerCase()) {
            case "new":
                return "bg-green-100 text-green-800"
            case "like new":
                return "bg-blue-100 text-blue-800"
            case "good":
                return "bg-yellow-100 text-yellow-800"
            case "fair":
                return "bg-orange-100 text-orange-800"
            case "poor":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }
    const truncateDescription = (text: string, maxLength = 100) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
    }


    const imageSrc = images[`../../../assets/bookCovers/${book.image}`];



    return (

        <div className=" mr-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden max-w-sm">
            {/* Book Image */}
            <div className="relative">
                <img
                    src={imageSrc}
                    alt={`${book.title} cover`}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(book.condition)}`}>
            {book.condition}
          </span>
                </div>
            </div>

            {/* Book Details */}
            <div className="p-4">
                {/* Title and Author */}
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                </div>

                {/* Category */}
                <div className="mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{book.category}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4">{truncateDescription(book.description)}</p>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-green-600"></div>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                        Request
                    </button>
                </div>
            </div>
        </div>
    );
}
interface Props {
  title: string;
  image: string;
  onClick: () => void;
}

const CircleCard: React.FC<Props> = ({ title, image, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        dark:bg-gray-500 text-gray-500 dark:text-white rounded-xl shadow-md
        flex flex-col items-center justify-center
        p-6 w-48 h-50
        transition-all duration-300 ease-in-out
        hover:scale-110 hover:shadow-xl
        active:scale-95
      "
    >
      {/* Image */}
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-center">
        {title}
      </p>
    </div>
  );
};

export default CircleCard;

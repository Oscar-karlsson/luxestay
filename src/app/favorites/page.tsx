import propertyData from '../../data/properties.json';
import FavoriteCard from '@/components/FavoriteCard';

const FavoritesPage = () => {
  const favoriteProperties = propertyData.filter((property) => property.isFavorite);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Favorite Properties</h1>
      {favoriteProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <FavoriteCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">You have no favorite properties yet.</p>
      )}
    </div>
  );
};

export default FavoritesPage;

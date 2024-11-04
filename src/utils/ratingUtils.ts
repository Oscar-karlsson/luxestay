type Review = {
    rating: number;
  };
  
  export const calculateRatingData = (reviews: Review[]) => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    
    return { averageRating, totalReviews };
  };
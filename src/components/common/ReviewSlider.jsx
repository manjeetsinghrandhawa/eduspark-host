import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"

// Icons
import { FaStar } from "react-icons/fa"
import { Autoplay, FreeMode, Pagination } from "swiper"

// Get API function and endpoints
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
        if (data?.success) {
          setReviews(data?.data)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    })()
  }, [])

  return (
    <div className="text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-richblack-5">Student Reviews</h2>
      <div className="w-[1100px] max-w-[1200px] px-4">  {/* Ensures max width */}
        <Swiper
          slidesPerView={1}  // Default for small screens
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }, 
          }}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full py-6"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i} className="flex justify-center">  {/* Centers cards */}
              <div className="w-full max-w-[350px] flex flex-col gap-4 bg-richblack-800 p-6 rounded-lg shadow-md">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt="User"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h1 className="text-lg font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                    <h2 className="text-sm text-richblack-500">{review?.course?.courseName}</h2>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-sm text-richblack-25 leading-relaxed">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review.split(" ").slice(0, truncateWords).join(" ")} ...`
                    : review?.review}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-yellow-100">{review.rating.toFixed(1)}</h3>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider

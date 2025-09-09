import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Slider, { SliderItem } from '@ui/slider';
import NewsTicker from '@components/news-ticker';
import axios  from 'axios';
import SingleSlide from './slide';

const HeroArea = ({ data }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	useEffect(() => {
  const fetchNews = async () => {
    try {
      const result = await axios.get(`${apiBaseUrl}/news`);
      setNews(result.data.news); // التصحيح هنا
      setLoading(false);
    } catch (error) {
      console.error('خطأ أثناء جلب الأخبار:', error);
    }
  };

  fetchNews();
}, []);


  return (
    <div className="rn-banner-area">
      {data && (
        <>
          <Slider
            options={{ dots: true }}
            className="p-container slider-activation-banner-4 game-banner-short-slick-wrapper slick-arrow-style-one rn-slick-dot-style"
          >
            {data.map((banner) => (
              <SliderItem
                key={banner.id}
                className="slider-style-7 border-radious-none pt--150 pb--190 pt_sm--70 pb_sm--70"
                data-black-overlay="6"
              >
                <SingleSlide title={banner.title} image={banner.image_url} />
              </SliderItem>
            ))}
          </Slider>

          {/* شريد الأخبار */}
      <div className="rrrrrrr">
          {!loading && news.length > 0 && <NewsTicker news={news} />}
        
      </div> 
        </>
      )}
    </div>
  );
};

HeroArea.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default HeroArea;

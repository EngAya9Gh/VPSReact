import PropTypes from 'prop-types';

const NewsTicker = ({ news }) => {
  return (
    <div className="tickerWrapper">
      <div className="tickerContent">
        {news.map((item, i) => (
          <span key={i} className="tickerItem">
             <span className="separator">*</span>
            {item.title}
           
          </span>
        ))}
      </div>
    </div>
  );
};

NewsTicker.propTypes = {
  news: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default NewsTicker;

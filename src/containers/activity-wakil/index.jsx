import PropTypes from 'prop-types';
import clsx from 'clsx';
import Anchor from '@ui/anchor';

const ActivityArea = ({ space, className, data }) => {
  
    return (
        <div
            className={clsx(
                'rn-activity-area',
                space === 1 && 'rn-section-gapTop',
                className
            )}
        >
            <div className="container">
                <div className="row mb--30">
                    <h3 className="title">وكلاؤنا </h3>
                </div>
                <div className="row g-12 activity-direction">
                    <div className="col-lg-8 mb_dec--15">
                        {data?.myItems?.programs?.data?.length > 0 ? (
                            data.myItems.programs.data.map((item) => (
                                <div className={clsx('single-activity-wrapper', className)} key={item.id}>
                                    <div className="inner">
                                        <div className="read-content">
                                          
																						<br></br>
                                            <div className="content">
                                                <div className="time-maintane">
                                                    <div className="user-area data">
                                                        <p>{item.note || "No Note"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ActivityArea.propTypes = {
    space: PropTypes.oneOf([1, 2]),
    className: PropTypes.string,
    data: PropTypes.shape({
        myItems: PropTypes.shape({
            programs: PropTypes.shape({
                data: PropTypes.arrayOf(
                    PropTypes.shape({
                        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                        note: PropTypes.string,
                    })
                ),
            }),
        }),
    }),
};

ActivityArea.defaultProps = {
    space: 1,
    data: { myItems: { programs: { data: [] } } },
};

export default ActivityArea;

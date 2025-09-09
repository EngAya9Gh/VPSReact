import PropTypes from 'prop-types';
import clsx from 'clsx';
import Activity from '@components/activity';

const ActivityArea = ({ space, className, data,isService }) => (
	<div
		className={clsx(
			'rn-activity-area',
			space === 1 && 'rn-section-gapTop',
			className
		)}
	>
		<div className="container">
			<div className="row mb--30">
				<h3 className="title"></h3>{' '}
				{/* Add content to the heading */}
			</div>
			<div className="row g-12 activity-direction">
				<div className="col-lg-8 mb_dec--15">
					{isService? data?.activities?.map((item) => (
						<Activity
							key={item.id}
							author={item.author}
							image="/images/portfolio/portfolio-07.jpg"
							isService
						/>
					)):data?.activities?.map((item) => (
						<Activity
							key={item.id}
							author={item.name}
							image="/images/portfolio/portfolio-07.jpg"
							isService
						/>
					))}
				</div>
			</div>
		</div>
	</div>
);

ActivityArea.propTypes = {
	space: PropTypes.oneOf([1, 2]),
	className: PropTypes.string,
	data: PropTypes.shape({
		activities: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				title: PropTypes.string,
				slug: PropTypes.string,
				description: PropTypes.string,
				date: PropTypes.string,
				time: PropTypes.string,
				author: PropTypes.shape({
					name: PropTypes.string,
					slug: PropTypes.string
				}),
				image: PropTypes.shape({
					url: PropTypes.string,
					alt: PropTypes.string
				}),
				status: PropTypes.oneOf(['follow', 'sale', 'like', 'offer']),
				marketFilters: PropTypes.arrayOf(PropTypes.string),
				userFilters: PropTypes.arrayOf(PropTypes.string)
			})
		)
	})
};

ActivityArea.defaultProps = {
	space: 1,
	data: { activities: [] } // Provide a default value to avoid errors if data is not provided
};

export default ActivityArea;

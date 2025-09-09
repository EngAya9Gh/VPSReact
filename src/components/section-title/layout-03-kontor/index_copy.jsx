import PropTypes from 'prop-types';
import clsx from 'clsx';

const SectionTitle = ({ title, subtitle, className, disableAnimation }) => (
	<div className={clsx('section-title-wrapper', className)}>
		<h3
			className="title"
			data-sal-delay="150"
			data-sal={!disableAnimation && 'slide-up'}
			data-sal-duration="800"
		>
			{title}
		</h3>
		{subtitle && <p className="subtitle">{subtitle}</p>}
	</div>
);

SectionTitle.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
	className: PropTypes.string,
	disableAnimation: PropTypes.bool
};

export default SectionTitle;

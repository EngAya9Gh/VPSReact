import PropTypes from 'prop-types';
import clsx from 'clsx';
import SignupForm from '@components/signup-form-agent';

const SignupArea = ({ agent_info, className, space }) => (
	<div
		className={clsx(
			'login-area',
			space === 1 && 'rn-section-gapTop_1',
			className
		)}
	>
		<div className="container">
			<div className="row g-5">
				<div className="offset-2 col-lg-12 col-md-12 ml_md--0 ml_sm--0 col-sm-12">
					<SignupForm agent_info={agent_info} />
				</div>
			</div>
		</div>
	</div>
);

SignupArea.propTypes = {
	agent_info: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string,
		phone: PropTypes.string
		// Add more properties here based on the structure of agent_info
	}).isRequired,
	className: PropTypes.string,
	space: PropTypes.oneOf([1])
};

SignupArea.defaultProps = {
	space: 1
};

export default SignupArea;

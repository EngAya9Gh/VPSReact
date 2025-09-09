import SEO from '@components/seo';
import Wrapper from '@layout/wrapper';
import Breadcrumb from '@components/breadcrumb';
import LoginAreaTest from '@containers/login-test';

export async function getStaticProps() {
	return { props: { className: 'template-color-1' } };
}
const LoginTest = () => (
	<Wrapper>
		<SEO pageTitle="تسجيل الدخول - تجريبي" />

		<main id="main-content">
			<Breadcrumb pageTitle="تسجيل الدخول - تجريبي" currentPage="Test Login" />
			<LoginAreaTest />
		</main>
	</Wrapper>
);

export default LoginTest;

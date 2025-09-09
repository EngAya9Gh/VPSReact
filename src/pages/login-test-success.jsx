import SEO from '@components/seo';
import Wrapper from '@layout/wrapper';
import Breadcrumb from '@components/breadcrumb';
import { useRouter } from 'next/router';
import Button from '@ui/button';

export async function getStaticProps() {
	return { props: { className: 'template-color-1' } };
}

const LoginTestSuccess = () => {
	const router = useRouter();

	return (
		<Wrapper>
			<SEO pageTitle="نجح تسجيل الدخول - تجريبي" />

			<main id="main-content">
				<Breadcrumb pageTitle="نجح تسجيل الدخول - تجريبي" currentPage="Login Success" />

				<div className="login-area rn-section-gapTop_1">
					<div className="container">
						<div className="row g-5">
							<div className="offset-2 col-lg-12 col-md-12 ml_md--0 ml_sm--0 col-sm-12">
								<div className="form-wrapper-one product-style-one" style={{ textAlign: 'center', padding: '40px' }}>
									<div style={{ fontSize: '64px', color: '#28a745', marginBottom: '20px' }}>
										🎉
									</div>
									<h2 style={{ color: '#28a745', marginBottom: '20px' }}>
										تم تسجيل الدخول بنجاح!
									</h2>
									<p style={{ color: '#6c757d', marginBottom: '30px', fontSize: '16px' }}>
										مرحباً بك في الوضع التجريبي. جميع الميزات تعمل بشكل طبيعي.
									</p>

									<div style={{
										background: '#f8f9fa',
										borderRadius: '10px',
										padding: '20px',
										marginBottom: '30px',
										border: '2px dashed #59C4BC'
									}}>
										<h5 style={{ color: '#59C4BC', marginBottom: '15px' }}>
											🧪 وضع تجريبي
										</h5>
										<p style={{ color: '#495057', margin: 0, fontSize: '14px' }}>
											هذه صفحة تجريبية منفصلة عن النظام الأساسي.
											يمكنك اختبار جميع الميزات هنا دون التأثير على البيانات الحقيقية.
										</p>
									</div>

									<div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
										<Button
											onClick={() => router.push('/login-test')}
											size="medium"
											style={{
												background: 'linear-gradient(45deg, #59C4BC, #637AAE)',
												border: 'none'
											}}
										>
											العودة لصفحة الدخول التجريبية
										</Button>
										<Button
											onClick={() => router.push('/')}
											size="medium"
											style={{
												background: '#6c757d',
												border: 'none'
											}}
										>
											الذهاب للصفحة الرئيسية
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</Wrapper>
	);
};

export default LoginTestSuccess;

import { Helmet } from 'react-helmet-async';

const Meta = ({ title='Welcome To dynamik Blog', description='Your all time companion', keywords='social, blog, entertainment, news, tech' }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

export default Meta;
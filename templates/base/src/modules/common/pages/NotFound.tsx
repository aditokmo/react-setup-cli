import '@/styles/404.css';

export const NotFound = () => {
    return (
        <div className="not-found-wrapper">
            <div className="not-found-content">
                <span>404</span>
                <h1>Oops! Page Not Found</h1>
                <p>The page you are looking for doesn't exist. Click button below to go to the homepage</p>
                <a href="/">Back to Homepage</a>
            </div>
        </div>
    );
};
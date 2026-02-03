export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl mb-8">Page Not Found</p>
                <a href="/" className="text-blue-400 hover:text-blue-300 underline">
                    Return Home
                </a>
            </div>
        </div>
    );
}

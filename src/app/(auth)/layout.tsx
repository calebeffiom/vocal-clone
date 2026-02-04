export default function AuthLayout({ children }: { children: React.ReactNode }) {
    // 3. Render the Layout (Only if status is 'unauthenticated')
    return (
        <div className="min-h-screen p-0 sm:p-4">
            {/* <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-xl"> */}
                {/* The children prop holds the content of signin/signup page.tsx */}
                {children}
            {/* </div> */}
        </div>
    );
}

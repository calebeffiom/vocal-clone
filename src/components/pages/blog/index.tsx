const BlogPage = () => {
    return (
        <section>
            <div className="flex flex-cols gap-4">
                <div className="flex flex-col gap-2">
                    <h1>Accepting Limits</h1>
                    <h2>Something That Many (Including Myself) Struggle With</h2>

                    <div className="flex flex-row gap-2">
                        <div className="writer-image-cont">
                            <img src="assets/profile.png" className="h-[50px]" alt="" />
                        </div>


                        <div className="flex flex-col gap-1">
                            <h4>Caleb</h4>
                            <p className="text-[#8f8f8f] text-[13px]">published 7 days ago • 3 min read </p>
                        </div>
                    </div>

                </div>
                <div></div>
                <div></div>
            </div>
        </section>
    )
}
export default BlogPage
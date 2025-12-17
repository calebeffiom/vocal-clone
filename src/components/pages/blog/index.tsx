import { Container } from "@shared"
import CommentCard from "./comment-card"
import { Heart, MessageCircle, Forward, Share, ForwardIcon, Share2, } from "lucide-react"

const BlogPage = () => {
    return (
        <section>

            <div className="flex flex-col gap-11 py-[100px]">
                <Container>
                    <div className="flex flex-col gap-3 w-fit mx-auto">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[50px] font-bold">Accepting Limits</h1>
                            <h2 className="text-[25px] font-medium text-[#8f8f8f]">Something That Many (Including Myself) Struggle With.</h2>
                        </div>

                        <div className="flex flex-row gap-2">
                            <div className="writer-image-cont">
                                <img src="/images/profile.png" className="h-[50px]" alt="" />
                            </div>


                            <div className="flex flex-col gap-1">
                                <h4>Caleb</h4>
                                <p className="text-[#8f8f8f] text-[13px]">published 7 days ago • 3 min read </p>
                            </div>
                        </div>

                    </div>
                </Container>
                
                <div className="w-[85%] h-[650px] mx-auto px-4 sm:px-6 lg:px-8">
                    <img src="/images/ice.jpeg" className="h-full w-full rounded-xl" alt="" />
                </div>
                

                <Container>
                    <div className="flex flex-col gap-8 w-[80%] mx-auto">
                        <div className="flex flex-col gap-8 mx-auto">
                            <p className="text-xl font-normal leading-loose">Many of us are told...

                                We can be anything that we want to be...

                                If you can dream it, you can do it...

                                The sky is the limit.

                                Now, I'm not here to try to rain on your parade...

                                I have no intention of telling you that you cannot pursue the dreams you have.

                                But here's the thing...

                                You cannot do everything.

                                Not all at once.

                                As Humans, we have real Limitations that we must work around.

                                Time.

                                Resources.

                                Energy.

                            </p>

                            <p className="text-xl font-normal leading-loose">Yes, we may have goals we want to attain.

                                It is possible that all of those goals are things we are capable of accomplishing.

                                But sometimes, our limitations impose real challenges on the timeframes that we may want to attain those goals in.

                                I know that this is one that I struggle with myself.

                                I have many goals in my life, and I truly believe that all of those goals are within my capabilities.

                                But most of these goals are not small goals.

                                Some of them are gigantic goals.

                                Impactful goals.

                                But they are also goals that will require resources, time, energy, and some dedicated training.</p>



                            <p className="text-xl font-normal leading-loose">Yes, we may have goals we want to attain.

                                It is possible that all of those goals are things we are capable of accomplishing.

                                But sometimes, our limitations impose real challenges on the timeframes that we may want to attain those goals in.

                                I know that this is one that I struggle with myself.

                                I have many goals in my life, and I truly believe that all of those goals are within my capabilities.

                                But most of these goals are not small goals.

                                Some of them are gigantic goals.

                                Impactful goals.

                                But they are also goals that will require resources, time, energy, and some dedicated training.</p>



                            <p className="text-xl font-normal leading-loose">Yes, we may have goals we want to attain.

                                It is possible that all of those goals are things we are capable of accomplishing.

                                But sometimes, our limitations impose real challenges on the timeframes that we may want to attain those goals in.

                                I know that this is one that I struggle with myself.

                                I have many goals in my life, and I truly believe that all of those goals are within my capabilities.

                                But most of these goals are not small goals.

                                Some of them are gigantic goals.

                                Impactful goals.

                                But they are also goals that will require resources, time, energy, and some dedicated training.</p>
                        </div>

                        <div className="w-full">
                            <div className="p-4 border-t-[2px] border-b-[2px] border-[#8f8f8f] flex justify-between  mx-auto">
                                <div className="flex gap-4">
                                    <span className="flex p-2 rounded-xl gap-2 text-[#8f8f8f] hover:bg-[#8f8f8f]/10">
                                        <MessageCircle />
                                        0
                                    </span>
                                    <span className="flex p-2 rounded-xl gap-2 text-[#8f8f8f] hover:bg-[#8f8f8f]/10">
                                        <Heart />
                                        0
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                <span className="flex p-2 rounded-xl gap-2 text-[#8f8f8f] hover:bg-[#8f8f8f]/10">
                                        <Share2 />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-10">
                        <CommentCard />
                        <CommentCard />
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    )
}
export default BlogPage
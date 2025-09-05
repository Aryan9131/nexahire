import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Star, User, Mail, Calendar, TrendingUp } from "lucide-react";

type userProfileProps = {
    userName: string | undefined
    userEmail: string | undefined
    feedback: {
        rating: {
            technicalSkills: number | undefined,
            communication: number | undefined,
            problemSolving: number | undefined,
            experience: number | undefined
        },
        summary?: string,
        recommendation?: string,
        created_at?: string
    } | undefined
    onClick: () => void
};

const UserProfile = ({ userName, userEmail, feedback, onClick }: userProfileProps) => {
    console.log("userProfile props : ", JSON.stringify({ userName, userEmail, feedback }));
    
    const getInitials = (name: string | undefined) => {
        if (!name) return "UN";
        return name.split('_').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRatingColor = (rating: number | undefined) => {
        if (!rating) return "bg-gray-200";
        if (rating >= 8) return "bg-green-500";
        if (rating >= 6) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getRatingLabel = (rating: number | undefined) => {
        if (!rating) return "Not Rated";
        if (rating >= 8) return "Excellent";
        if (rating >= 6) return "Good";
        return "Needs Improvement";
    };

    const getOverallRating = () => {
        if (!feedback?.rating) return 0;
        const ratings = [
            feedback.rating.technicalSkills,
            feedback.rating.communication,
            feedback.rating.problemSolving,
            feedback.rating.experience
        ].filter(r => r !== undefined) as number[];
        
        if (ratings.length === 0) return 0;
        return Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length * 10) / 10;
    };

    const getRecommendationBadge = (recommendation: string | undefined) => {
        if (!recommendation) return null;
        
        if (recommendation.toLowerCase().includes('recommended') || recommendation.toLowerCase().includes('hire')) {
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ Recommended</Badge>;
        } else if (recommendation.toLowerCase().includes('not recommended')) {
            return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">✗ Not Recommended</Badge>;
        } else {
            return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⚠ Under Review</Badge>;
        }
    };

    return (
        <Dialog>
            <DialogTrigger className='text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors' onClick={onClick}>
                View Report
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Candidate Evaluation Report
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Comprehensive feedback and assessment details
                    </DialogDescription>
                </DialogHeader>

                {/* Candidate Profile Section */}
                <Card className="mb-6">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                                    {getInitials(userName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-500" />
                                    {userName?.replace(/_/g, ' ') || 'Unknown Candidate'}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4" />
                                    {userEmail || 'No email provided'}
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-gray-800">{getOverallRating()}/10</div>
                                <div className="text-sm text-gray-500">Overall Rating</div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Skills Assessment Section */}
                {feedback?.rating && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                Skills Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { key: 'technicalSkills', label: 'Technical Skills', icon: '🔧' },
                                { key: 'communication', label: 'Communication', icon: '💬' },
                                { key: 'problemSolving', label: 'Problem Solving', icon: '🧩' },
                                { key: 'experience', label: 'Experience', icon: '📈' }
                            ].map(({ key, label, icon }) => {
                                const rating = feedback.rating[key as keyof typeof feedback.rating];
                                return (
                                    <div key={key} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{icon}</span>
                                                <span className="font-medium text-gray-700">{label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={`${getRatingColor(rating)} text-white border-none`}>
                                                    {rating || 0}/10
                                                </Badge>
                                                <span className="text-sm text-gray-500">
                                                    {getRatingLabel(rating)}
                                                </span>
                                            </div>
                                        </div>
                                        <Progress value={(rating || 0) * 10} className="h-2" />
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                )}

                {/* Feedback Summary Section */}
                {feedback?.summary && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-600" />
                                Detailed Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 rounded-lg p-4 leading-relaxed text-gray-700">
                                {feedback.summary}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recommendation Section */}
                {feedback?.recommendation && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-600" />
                                Recommendation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <p className="text-gray-700 leading-relaxed">{feedback.recommendation}</p>
                                </div>
                                <div>
                                    {getRecommendationBadge(feedback.recommendation)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Report Metadata */}
                {feedback?.created_at && (
                    <div className="text-center text-sm text-gray-500 border-t pt-4">
                        Report generated on {new Date(feedback.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default UserProfile
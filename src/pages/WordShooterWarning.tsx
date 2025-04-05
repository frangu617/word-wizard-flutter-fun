import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import KidNavButton from '@/components/KidNavButton';
import { Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';


export default function WordShooterWarning(){
    return (
        <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-50">
            <header className="flex justify-between items-center mb-6">
                <Link to="/" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
                    <Home className="h-6 w-6 text-kid-blue" />
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-kid-green">Word Shooter</h1>
                <div className="w-10"></div>
            </header>
            <Card className="kid-bubble border-kid-green p-6">
                <CardContent className="pt-0 text-center">
                    <h3 className="text-2xl font-bold mb-4">This game works well with touch controls, not with mouse or keyboard.</h3>
                    <p className="mb-4">To continue to game please touch the button below.</p>
                    <div className="flex justify-center">
                <KidNavButton
                    to="/word-shooter"
                    color="kid-red"
                    icon={<Target />}
                >
                    Start Game
                </KidNavButton>
            </div>
                </CardContent>
            </Card>
            
        </div>
    );
};
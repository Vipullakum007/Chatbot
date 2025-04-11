import { FormEvent } from 'react';
import { CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send, Paperclip, Mic } from 'lucide-react';

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

const ChatInput = ({
    input,
    setInput,
    isLoading,
    onSendMessage
}: ChatInputProps) => {

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
        }
    };

    return (
        <CardFooter className="border-t p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-blue-500"
                    disabled={isLoading}
                >
                    <Paperclip className="h-5 w-5" />
                </Button>

                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow bg-gray-100 border-0 focus-visible:ring-blue-500"
                    disabled={isLoading}
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-blue-500"
                    disabled={isLoading}
                >
                    <Mic className="h-5 w-5" />
                </Button>

                <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </CardFooter>
    );
};

export default ChatInput;
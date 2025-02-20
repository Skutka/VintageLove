import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Send, Heart, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
}

interface ChatPartner {
  id: string;
  name: string;
  profile_image: string;
  last_message_time?: string;
}

export function MessagesView({ user }: { user: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [matches, setMatches] = useState<ChatPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMatches = async () => {
    try {
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('to_user_id')
        .eq('from_user_id', user.id);

      if (likesError) throw likesError;

      const { data: likedBy, error: likedByError } = await supabase
        .from('likes')
        .select('from_user_id')
        .eq('to_user_id', user.id);

      if (likedByError) throw likedByError;

      const mutualIds = likes
        .map(like => like.to_user_id)
        .filter(id => likedBy.some(like => like.from_user_id === id));

      if (mutualIds.length > 0) {
        const { data: lastMessages, error: messagesError } = await supabase
          .from('messages')
          .select('sender_id, receiver_id, created_at')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .in('sender_id', [user.id, ...mutualIds])
          .in('receiver_id', [user.id, ...mutualIds])
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, profile_image')
          .in('id', mutualIds);

        if (profilesError) throw profilesError;

        const matchesWithLastMessage = profiles.map(profile => {
          const lastMessage = lastMessages?.find(msg => 
            msg.sender_id === profile.id || msg.receiver_id === profile.id
          );
          return {
            ...profile,
            last_message_time: lastMessage?.created_at
          };
        });

        const sortedMatches = matchesWithLastMessage.sort((a, b) => {
          if (!a.last_message_time) return 1;
          if (!b.last_message_time) return -1;
          return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
        });

        setMatches(sortedMatches);

        if (!selectedPartner && sortedMatches.length > 0) {
          setSelectedPartner(sortedMatches[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      setIsRefreshing(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      const unreadMessages = data?.filter(msg => 
        msg.receiver_id === user.id && !msg.read
      ) || [];

      if (unreadMessages.length > 0) {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadMessages.map(msg => msg.id));

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsRefreshing(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner || !newMessage.trim() || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    try {
      setIsSending(true);

      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        id: tempId,
        sender_id: user.id,
        receiver_id: selectedPartner.id,
        content: messageText,
        created_at: new Date().toISOString(),
        read: false
      };

      // Optimistically add message
      setMessages(prev => [...prev, tempMessage]);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedPartner.id,
          content: messageText
        })
        .select()
        .single();

      if (error) throw error;

      // Replace temp message with real one
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? data : msg
      ));

      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

      // Refresh matches to update last message time
      fetchMatches();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Remove the optimistic message and restore the text
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
      setNewMessage(messageText);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMatches();

      const messagesChannel = supabase.channel('messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            if (selectedPartner && payload.new.sender_id === selectedPartner.id) {
              setMessages(prev => [...prev, payload.new as Message]);
              fetchMatches();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messagesChannel);
      };
    }
  }, [user, selectedPartner]);

  useEffect(() => {
    if (selectedPartner) {
      fetchMessages(selectedPartner.id);
    }
  }, [selectedPartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRefresh = async () => {
    if (selectedPartner) {
      await fetchMessages(selectedPartner.id);
      toast.success('Messages refreshed');
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)]">
      <div className="w-1/3 border-r">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Your Matches</h2>
          <div className="space-y-2">
            {matches.map(match => (
              <button
                key={match.id}
                onClick={() => setSelectedPartner(match)}
                className={`w-full p-3 flex items-center space-x-3 rounded-lg transition ${
                  selectedPartner?.id === match.id
                    ? 'bg-purple-100'
                    : 'hover:bg-gray-100'
                }`}
              >
                <img
                  src={match.profile_image}
                  alt={match.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium">{match.name}</span>
              </button>
            ))}
            {matches.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No matches yet. Start liking profiles to find matches!
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedPartner ? (
          <>
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedPartner.profile_image}
                  alt={selectedPartner.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium">{selectedPartner.name}</span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender_id === user.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <Send className={`h-5 w-5 ${isSending ? 'opacity-50' : ''}`} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-2" />
              <p>Select a match to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
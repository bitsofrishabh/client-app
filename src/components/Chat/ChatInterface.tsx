import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Input, Button, Space, Avatar, Image, message, Upload } from 'antd';
import { SendOutlined, CameraOutlined, UserOutlined } from '@ant-design/icons';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { ChatMessage } from '../../types';

const { Title, Text } = Typography;

const ChatInterface: React.FC = () => {
  const { user, clientData } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chatMessages'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(messagesData);
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    setLoading(true);
    try {
      const messageData = {
        clientId: user.uid,
        senderId: user.uid,
        senderName: clientData?.name || user.displayName || 'Client',
        senderType: 'client',
        message: newMessage.trim(),
        messageType: 'text',
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'chatMessages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const sendImage = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `chat/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const messageData = {
        clientId: user.uid,
        senderId: user.uid,
        senderName: clientData?.name || user.displayName || 'Client',
        senderType: 'client',
        message: 'Sent an image',
        messageType: 'image',
        attachmentUrl: downloadURL,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'chatMessages'), messageData);
      message.success('Image sent successfully!');
    } catch (error) {
      console.error('Error sending image:', error);
      message.error('Failed to send image');
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach((message) => {
      const dateKey = formatDate(message.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Card 
        style={{ 
          borderRadius: 0, 
          borderBottom: '1px solid #f0f0f0',
          background: 'linear-gradient(135deg, #2E7D5A 0%, #4CAF50 100%)'
        }}
      >
        <div style={{ color: 'white' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            Chat with Your Dietician
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
            Get personalized guidance and support
          </Text>
        </div>
      </Card>

      {/* Messages */}
      <div className="chat-messages" style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div style={{ 
              textAlign: 'center', 
              margin: '16px 0',
              position: 'relative'
            }}>
              <div style={{
                background: '#f0f0f0',
                padding: '4px 12px',
                borderRadius: 12,
                display: 'inline-block',
                fontSize: 12,
                color: '#666'
              }}>
                {date}
              </div>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.senderType === 'client' ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}
              >
                <div style={{ maxWidth: '80%' }}>
                  {msg.senderType === 'dietician' && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: 4,
                      gap: 8
                    }}>
                      <Avatar size={24} icon={<UserOutlined />} />
                      <Text style={{ fontSize: 12, color: '#666' }}>
                        {msg.senderName}
                      </Text>
                    </div>
                  )}
                  
                  <div
                    style={{
                      background: msg.senderType === 'client' 
                        ? 'linear-gradient(135deg, #2E7D5A 0%, #4CAF50 100%)'
                        : '#f0f0f0',
                      color: msg.senderType === 'client' ? 'white' : '#333',
                      padding: '12px 16px',
                      borderRadius: 16,
                      borderTopRightRadius: msg.senderType === 'client' ? 4 : 16,
                      borderTopLeftRadius: msg.senderType === 'dietician' ? 4 : 16,
                    }}
                  >
                    {msg.messageType === 'image' && msg.attachmentUrl ? (
                      <div>
                        <Image
                          src={msg.attachmentUrl}
                          alt="Shared image"
                          style={{ 
                            maxWidth: 200, 
                            borderRadius: 8,
                            marginBottom: msg.message !== 'Sent an image' ? 8 : 0
                          }}
                        />
                        {msg.message !== 'Sent an image' && (
                          <div>{msg.message}</div>
                        )}
                      </div>
                    ) : (
                      <Text style={{ 
                        color: msg.senderType === 'client' ? 'white' : '#333' 
                      }}>
                        {msg.message}
                      </Text>
                    )}
                  </div>
                  
                  <div style={{ 
                    textAlign: msg.senderType === 'client' ? 'right' : 'left',
                    marginTop: 4
                  }}>
                    <Text style={{ fontSize: 11, color: '#999' }}>
                      {formatTime(msg.createdAt)}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input" style={{ 
        padding: '16px', 
        borderTop: '1px solid #f0f0f0',
        background: 'white',
        paddingBottom: '80px'
      }}>
        <Space.Compact style={{ width: '100%' }}>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              sendImage(file);
              return false;
            }}
            disabled={uploading}
          >
            <Button
              icon={<CameraOutlined />}
              loading={uploading}
              style={{ borderRadius: '8px 0 0 8px' }}
            />
          </Upload>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onPressEnter={sendMessage}
            style={{ borderRadius: 0 }}
          />
          
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            loading={loading}
            disabled={!newMessage.trim()}
            style={{ 
              borderRadius: '0 8px 8px 0',
              background: 'linear-gradient(135deg, #2E7D5A 0%, #4CAF50 100%)',
              border: 'none'
            }}
          />
        </Space.Compact>
      </div>
    </div>
  );
};

export default ChatInterface;
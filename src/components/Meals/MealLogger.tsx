import React, { useState } from 'react';
import { Card, Typography, Button, Upload, Input, Select, Space, message, Row, Col, Image } from 'antd';
import { CameraOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { storage, db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;
const { TextArea } = Input;

const MealLogger: React.FC = () => {
  const { user } = useAuth();
  const [selectedMealType, setSelectedMealType] = useState<string>('breakfast');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const mealTypes = [
    { label: 'Breakfast', value: 'breakfast', icon: '🍳' },
    { label: 'Lunch', value: 'lunch', icon: '🥗' },
    { label: 'Dinner', value: 'dinner', icon: '🍽️' },
    { label: 'Snack', value: 'snack', icon: '🍎' },
  ];

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `meals/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setImageUrl(downloadURL);
      setImageFile(file);
      message.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !description.trim()) {
      message.error('Please add a description for your meal.');
      return;
    }

    setUploading(true);
    try {
      const mealData = {
        clientId: user.uid,
        date: new Date().toISOString().split('T')[0],
        mealType: selectedMealType,
        description: description.trim(),
        notes: notes.trim(),
        photoUrl: imageUrl,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'mealEntries'), mealData);
      
      // Reset form
      setDescription('');
      setNotes('');
      setImageUrl(null);
      setImageFile(null);
      
      message.success('Meal logged successfully!');
    } catch (error) {
      console.error('Error logging meal:', error);
      message.error('Failed to log meal. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
    setImageFile(null);
  };

  return (
    <div style={{ padding: '16px', paddingBottom: '80px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 600 }}>
            Log Your Meal
          </Title>
          <Text type="secondary">
            Take a photo and describe what you're eating
          </Text>
        </div>

        <Card style={{ borderRadius: 12 }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Meal Type Selection */}
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Meal Type
              </Text>
              <Row gutter={[8, 8]}>
                {mealTypes.map((meal) => (
                  <Col span={12} key={meal.value}>
                    <Button
                      type={selectedMealType === meal.value ? 'primary' : 'default'}
                      block
                      size="large"
                      onClick={() => setSelectedMealType(meal.value)}
                      style={{ 
                        borderRadius: 8, 
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{meal.icon}</span>
                      {meal.label}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Photo Upload */}
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Meal Photo
              </Text>
              {!imageUrl ? (
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleImageUpload(file);
                    return false;
                  }}
                  disabled={uploading}
                >
                  <div className="meal-photo-upload">
                    <CameraOutlined style={{ fontSize: 32, color: '#2E7D5A', marginBottom: 8 }} />
                    <div>
                      <Text strong>Take a photo of your meal</Text>
                      <br />
                      <Text type="secondary">Tap to open camera or select from gallery</Text>
                    </div>
                  </div>
                </Upload>
              ) : (
                <div style={{ position: 'relative' }}>
                  <Image
                    src={imageUrl}
                    alt="Meal photo"
                    className="meal-photo-preview"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      borderRadius: 6,
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                What did you eat? *
              </Text>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your meal (e.g., Grilled chicken with vegetables, Brown rice, etc.)"
                rows={3}
                style={{ borderRadius: 8 }}
              />
            </div>

            {/* Notes */}
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Additional Notes (Optional)
              </Text>
              <TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you feel? Any cravings? Portion size? etc."
                rows={2}
                style={{ borderRadius: 8 }}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              size="large"
              block
              icon={<PlusOutlined />}
              onClick={handleSubmit}
              loading={uploading}
              disabled={!description.trim()}
              style={{
                height: 48,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #2E7D5A 0%, #4CAF50 100%)',
                border: 'none',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Log Meal
            </Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default MealLogger;
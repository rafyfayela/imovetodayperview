import React, { useState } from 'react';
import { useSaveFamilyData } from '../../../hooks/useSaveFamilyData';
import { useDeleteChild } from '../../../hooks/useDeleteChild';
import TickAnimation from '../../components/Sucess/TickAnimation';

const SlidePanel = ({
  isOpen,
  onClose,
  topPadding = 100,
  userInfo = [],
  pickLocationMode,
  setPickLocationMode,
  selectedLocation,
}) => {
  const user = userInfo?.[0] || null;

  // If no user, render nothing
  if (!user) return null;

  const [showTick, setShowTick] = useState(false);

  // -------------------- Helpers --------------------
  const parseWorkplaceLocation = (loc) => {
    if (!loc) return { latitude: '', longitude: '' };
    if (typeof loc === 'string') {
      const parts = loc.split(',');
      if (parts.length === 2) {
        return {
          latitude: parseFloat(parts[0].trim()) || '',
          longitude: parseFloat(parts[1].trim()) || '',
        };
      }
      console.error('Invalid workplace_location format');
      return { latitude: '', longitude: '' };
    }
    if (typeof loc === 'object') {
      return {
        latitude: loc.latitude || '',
        longitude: loc.longitude || '',
      };
    }
    return { latitude: '', longitude: '' };
  };

  const initialWorkplaceLocation = parseWorkplaceLocation(user.workplace_location);

  const [userData, setUserData] = useState({
    family_size: user.family_size || '',
    workplace_name: user.workplace_name || '',
    workplace_city: user.workplace_city || '',
    workplace_location: initialWorkplaceLocation,
    children: Array.isArray(user.children) ? user.children : [],
  });

  const [familySize, setFamilySize] = useState(userData.family_size || '');
  const { saveFamilyData } = useSaveFamilyData();
  const { deleteChild } = useDeleteChild();

  // -------------------- Handlers --------------------
  const handleUserChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const getUaeClass = (grade, curriculum, stage) => {
    if (!stage) return '';
    if (stage === 'early_childhood_center') {
      switch ((grade || '').toLowerCase()) {
        case 'nursery':
          return 'KG1';
        case 'kg1':
          return 'KG2';
        case 'kg2':
          return 'Grade 1';
        default:
          return 'KG1';
      }
    }

    if (stage === 'school') {
      if (!curriculum) return '';
      if (curriculum === 'american') {
        const gradeNum = parseFloat(grade);
        if (isNaN(gradeNum) || gradeNum < 0) return '';
        return gradeNum >= 1 && gradeNum <= 12 ? `${gradeNum}th Grade` : 'Above Grade 12';
      }
      if (curriculum === 'british') {
        switch (grade) {
          case 'A*':
            return '12th Grade';
          case 'A':
            return '11th Grade';
          case 'B':
            return '10th Grade';
          case 'C':
            return '9th Grade';
          case 'D':
            return '8th Grade';
          case 'E':
            return '7th Grade';
          case 'U':
            return 'Below 7th Grade';
          default:
            return '';
        }
      }
      if (curriculum === 'french') {
        const score = parseFloat(grade);
        if (isNaN(score)) return '';
        if (score >= 16) return '12th Grade';
        if (score >= 14) return '11th Grade';
        if (score >= 12) return '10th Grade';
        if (score >= 10) return '9th Grade';
        if (score >= 8) return '8th Grade';
        return 'Below 8th Grade';
      }
    }

    if (stage === 'university') {
      const score = parseFloat(grade);
      if (isNaN(score)) return '';
      if (score >= 90) return 'Final Year';
      if (score >= 80) return 'Year 3';
      if (score >= 70) return 'Year 2';
      if (score >= 60) return 'Year 1';
      return 'Below Year 1';
    }

    if (stage === 'training_center') {
      switch (grade) {
        case 'in_progress':
        case 'completed':
        case 'certified':
          return 'Training Center';
        default:
          return '';
      }
    }

    return '';
  };

  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...userData.children];
    if (!updatedChildren[index]) return;

    if (field === 'education_stage' && value === 'early_childhood_center') {
      updatedChildren[index].current_grade = '';
    }

    updatedChildren[index][field] = value;

    const child = updatedChildren[index];
    const grade = field === 'current_grade' ? value : child.current_grade;
    const curriculum = field === 'preferred_curriculum' ? value : child.preferred_curriculum;
    const stage = field === 'education_stage' ? value : child.education_stage;

    updatedChildren[index].uae_equivalent = getUaeClass(grade, curriculum, stage);

    setUserData((prev) => ({ ...prev, children: updatedChildren }));
  };

  const handleDeleteChild = (index, childid) => {
    const updatedChildren = userData.children.filter((_, i) => i !== index);
    setUserData((prev) => ({ ...prev, children: updatedChildren }));
    if (childid) deleteChild(childid);
  };

  const handleAddChild = () => {
    const newChild = {
      full_name: '',
      age: 0,
      current_grade: '',
      education_stage: '',
      preferred_curriculum: '',
      uae_equivalent: '',
    };
    setUserData((prev) => ({ ...prev, children: [...prev.children, newChild] }));
  };

  const handleSave = async () => {
    const locationToSave = selectedLocation ||
      userData.workplace_location || { latitude: 25.224, longitude: 55.276 };
    const result = await saveFamilyData(familySize, locationToSave, userData.children);
    if (result?.success) {
      setShowTick(true);
      setTimeout(() => {
        setShowTick(false);
        onClose();
      }, 1500);
    }
  };

  // -------------------- Styles --------------------
  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '10px',
    backgroundColor: '#e9e9e9',
    marginBottom: '10px',
    fontSize: '15px',
  };
  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '15px',
    color: '#222',
  };
  const inputStyle = {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '6px 10px',
    width: '180px',
  };
  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ff5a5f',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
  };
  const deleteBtnStyle = {
    marginLeft: '10px',
    padding: '4px 8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#ff5a5f',
    color: '#FFF',
    cursor: 'pointer',
    fontSize: '12px',
  };

  // -------------------- Render --------------------
  return (
    <div
      style={{
        position: 'absolute',
        top: topPadding,
        left: 0,
        height: `calc(100% - ${topPadding}px)`,
        width: isOpen ? '100%' : '0',
        backgroundColor: '#fff',
        overflowY: 'auto',
        transition: 'width 0.3s ease',
        zIndex: 20,
        padding: isOpen ? '40px' : '0',
        fontFamily: "'Poppins', sans-serif",
        color: '#333',
      }}
    >
      {isOpen && (
        <div>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
            }}
          >
            <h2 style={{ fontSize: '26px', fontWeight: 600 }}>User & Children Information</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '22px',
                cursor: 'pointer',
                color: '#888',
              }}
            >
              ✕
            </button>
          </div>

          {/* User Info */}
          <div style={{ marginBottom: '40px' }}>
            <div style={sectionTitleStyle}>User Information</div>

            <div style={infoRowStyle}>
              <span>Family Size</span>
              <input
                type="number"
                min="1"
                value={familySize}
                onChange={(e) => setFamilySize(e.target.value)}
                style={inputStyle}
                placeholder="Enter family size"
              />
            </div>

            <div style={infoRowStyle}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Workplace Location</span>
                <small style={{ color: '#888', fontSize: '12px' }}>
                  Change your work position by clicking on the map!
                </small>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  value={
                    selectedLocation?.latitude && selectedLocation?.longitude
                      ? `${Number(selectedLocation.latitude).toFixed(3)}, ${Number(selectedLocation.longitude).toFixed(3)}`
                      : userData.workplace_location?.latitude &&
                          userData.workplace_location?.longitude
                        ? `${Number(userData.workplace_location.latitude).toFixed(3)}, ${Number(userData.workplace_location.longitude).toFixed(3)}`
                        : ''
                  }
                  readOnly
                  style={{ ...inputStyle, cursor: 'pointer', backgroundColor: '#f5f5f5' }}
                />
                <button
                  style={{
                    ...buttonStyle,
                    padding: '6px 10px',
                    fontSize: '13px',
                    backgroundColor: pickLocationMode ? '#4CAF50' : '#ff5a5f',
                  }}
                  onClick={() => setPickLocationMode(!pickLocationMode)}
                >
                  {pickLocationMode ? 'Click on Map...' : 'Change on Map'}
                </button>
              </div>
            </div>
          </div>

          {/* Children Info */}
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <div style={sectionTitleStyle}>Children Information</div>
              <button
                onClick={handleAddChild}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#4CAF50',
                  padding: '6px 12px',
                  fontSize: '14px',
                }}
              >
                + Add Child
              </button>
            </div>

            {userData.children.length === 0 ? (
              <p style={{ color: '#666', fontSize: '15px' }}>
                No children added yet. Click "Add Child" to get started.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {userData.children.map((child, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      borderLeft: '4px solid #ff5a5f',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <input
                        type="text"
                        value={child.full_name || ''}
                        onChange={(e) => handleChildChange(index, 'full_name', e.target.value)}
                        placeholder="Enter child's name"
                        style={{ ...inputStyle, fontWeight: 600, fontSize: '16px', width: '100%' }}
                      />
                      <button
                        style={deleteBtnStyle}
                        onClick={() => handleDeleteChild(index, child.id)}
                      >
                        Delete
                      </button>
                    </div>

                    {/* Stage */}
                    <div style={infoRowStyle}>
                      <span>Stage</span>
                      <select
                        value={child.education_stage || ''}
                        onChange={(e) =>
                          handleChildChange(index, 'education_stage', e.target.value)
                        }
                        style={inputStyle}
                      >
                        <option value="">-- Select Stage --</option>
                        <option value="early_childhood_center">Early Childhood Center</option>
                        <option value="school">School</option>
                        <option value="university">University</option>
                        <option value="training_center">Training Center</option>
                      </select>
                    </div>

                    {/* Curriculum */}
                    <div style={infoRowStyle}>
                      <span>Preferred Curriculum</span>
                      <select
                        value={child.preferred_curriculum || ''}
                        onChange={(e) =>
                          handleChildChange(index, 'preferred_curriculum', e.target.value)
                        }
                        style={inputStyle}
                      >
                        <option value="">-- Select Curriculum --</option>
                        <option value="american">American</option>
                        <option value="british">British</option>
                        <option value="french">French</option>
                      </select>
                    </div>

                    {/* Grade */}
                    <div style={infoRowStyle}>
                      <span>Grade</span>
                      {child.education_stage === 'early_childhood_center' ? (
                        <input
                          type="text"
                          value={child.current_grade || ''}
                          placeholder="Grade not required (Nursery, KG1)"
                          style={inputStyle}
                          disabled
                        />
                      ) : child.education_stage === 'school' ? (
                        <>
                          {child.preferred_curriculum === 'american' && (
                            <input
                              type="number"
                              min="0"
                              max="4"
                              step="0.1"
                              value={child.current_grade || ''}
                              onChange={(e) =>
                                handleChildChange(index, 'current_grade', e.target.value)
                              }
                              placeholder="Enter GPA (0–4)"
                              style={inputStyle}
                            />
                          )}
                          {child.preferred_curriculum === 'british' && (
                            <select
                              value={child.current_grade || ''}
                              onChange={(e) =>
                                handleChildChange(index, 'current_grade', e.target.value)
                              }
                              style={inputStyle}
                            >
                              <option value="">-- Select Grade --</option>
                              <option value="A*">A*</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                              <option value="E">E</option>
                              <option value="U">U</option>
                            </select>
                          )}
                          {child.preferred_curriculum === 'french' && (
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={child.current_grade || ''}
                              onChange={(e) =>
                                handleChildChange(index, 'current_grade', e.target.value)
                              }
                              placeholder="Enter Score (0–20)"
                              style={inputStyle}
                            />
                          )}
                        </>
                      ) : child.education_stage === 'university' ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={child.current_grade || ''}
                          onChange={(e) =>
                            handleChildChange(index, 'current_grade', e.target.value)
                          }
                          placeholder="Enter GPA or %"
                          style={inputStyle}
                        />
                      ) : child.education_stage === 'training_center' ? (
                        <select
                          value={child.current_grade || ''}
                          onChange={(e) =>
                            handleChildChange(index, 'current_grade', e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="">-- Select Status --</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="certified">Certified</option>
                        </select>
                      ) : null}
                    </div>

                    {/* UAE Equivalent */}
                    <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>
                      UAE Equivalent: <strong>{child.uae_equivalent || ''}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <div style={{ marginTop: '20px' }}>
            <button style={buttonStyle} onClick={handleSave}>
              {showTick ? <TickAnimation /> : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidePanel;

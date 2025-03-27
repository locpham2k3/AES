import React, { useState, useEffect } from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import catToroto from '../assets/CatToroto.gif'; 

const LoadingBar = () => {
  const [catTorotoPosition, setCatTorotoPosition] = useState(0);

  // Hiệu ứng di chuyển con mèo dọc theo thanh tiến trình
  useEffect(() => {
    const timer = setInterval(() => {
      setCatTorotoPosition((oldPosition) => {
        if (oldPosition >= 100) {
          return 0; // Khi đạt tới cuối thanh thì quay lại đầu
        }
        return oldPosition + 1; // Tăng dần vị trí
      });
    }, 50); // Tốc độ di chuyển

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#fff', // Nền trắng
        position: 'relative',
      }}
    >
      <Box sx={{ width: '70%', height: 10, position: 'relative' }}>
        {/* Thanh tiến trình với màu sắc phù hợp với Totoro */}
        <LinearProgress
          variant="determinate"
          value={100} // Thanh luôn đầy
          sx={{
            height: '100%', 
            backgroundColor: '#a3d9a5', // Màu xanh pastel 
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#607d8b', // Màu xám đậm 
            },
          }}
        />
        {/* Hình con mèo chạy (GIF) */}
        <img
          src={catToroto}
          alt="Con mèo"
          style={{
            position: 'absolute',
            top: '-50px', // Đặt hình phía trên thanh
            left: `${catTorotoPosition}%`, // Vị trí chạy dọc theo thanh
            transform: 'translateX(-50%)', // Đảm bảo hình ở chính giữa
            width: '80px', 
            height: 'auto', 
          }}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{ color: '#000', marginTop: 2 }} 
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingBar;

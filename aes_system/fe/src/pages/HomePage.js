import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const HomePage = () => {
  const navigate = useNavigate();

  const carouselItems = [
    {
      image: "https://th.bing.com/th/id/OIP.JvLsDNvZnm-PmhXvRrEcOwHaE7",
    },
    {
      image: "https://th.bing.com/th/id/OIP.JvLsDNvZnm-PmhXvRrEcOwHaE7",
    },
    {
      image: "https://th.bing.com/th/id/OIP.l5aM4TeVoCw8BwKpCwnAgwHaFd",
    },
  ];

  const features = [
    {
      title: "AI Scoring System",
      description: "Get instant essay scores with actionable insights.",
      icon: "https://img.icons8.com/color/96/artificial-intelligence.png",
    },
    {
      title: "Improve Skills",
      description: "Track progress and refine your writing skills over time.",
      icon: "https://img.icons8.com/color/96/check-file.png",
    },
    {
      title: "Trusted by Users",
      description: "Used by educators and students worldwide.",
      icon: "https://img.icons8.com/color/96/approval.png",
    },
  ];

  const testimonials = [
    {
      name: "- Ho Anh Dung, Sinh vien Dai hoc FPT",
      feedback:
        "This website has significantly improved my writing skills. The instant feedback helped me identify my mistakes and improve my essays quickly.",
      avatar:
        "https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-1/426557756_3564953206984656_7468599186390451436_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeGDeJbqbK5N3jm55jEq-mWUT_YOW2sDIFJP9g5bawMgUtO0MaAkQwACwbQ5wtw9AbkZI_5DNX3saFzea_nzUEL9&_nc_ohc=ni-PPbkCYUkQ7kNvgHMny5U&_nc_zt=24&_nc_ht=scontent.fhan3-3.fna&_nc_gid=AbJcM6XxBv8lfMGPmML26WT&oh=00_AYBfKTE2zbf9FOwbENvpEwHFGpPUHdNFF61O3y0BSoVEbg&oe=6750DDF4",
    },
    {
      name: "- Nguyen Trong Tai, Sinh vien Dai hoc FPT",
      feedback:
        "I love how easy it is to use this platform. The suggestions are clear and actionable, making revisions much less stressful.",
      avatar:
        "https://scontent.fhan4-4.fna.fbcdn.net/v/t1.6435-1/51608210_738317736554170_2770225073804541952_n.jpg?stp=dst-jpg_s200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeE4pzpyeJj3IO3GkCJqWaHXIQzim-1KCPUhDOKb7UoI9T8rAT1bNZSXrJ5qHj-9RY8ZCwwgXZh-ruL3vmz7tMq6&_nc_ohc=NbkQGaKYWWQQ7kNvgHlhrjk&_nc_zt=24&_nc_ht=scontent.fhan4-4.fna&_nc_gid=Au1vkRcwp_86TNJFJsRIL2M&oh=00_AYB2tm7DHR2IYs-2ufXc6Wl8HlphzV77124SeOGo-ooZcw&oe=677245CE",
    },
    {
      name: "- Nguyen Ngoc Tuan, Sinh vien Dai hoc FPT",
      feedback:
        "The feedback provided by the system is detailed and precise. It has helped me focus on specific areas like grammar, vocabulary, and coherence.",
      avatar:
        "https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/358115133_3568240746827154_4644488903831173338_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHtj1mG_HLKI_x2qQwNrcLzdXcei7Dlyc11dx6LsOXJzfjRIOtlm9qDZtvPr5vdJkuj0d7J7bBRt0lPsa7GkjUc&_nc_ohc=4XpMll0FXmUQ7kNvgEolfgT&_nc_zt=23&_nc_ht=scontent.fhan3-3.fna&_nc_gid=AIvI-fVUvv-GUQaGHkSlXm2&oh=00_AYAL8VzISyQgcsX6gSnc-s-LZRHy-rRRcVA2Jqzo7AC2-A&oe=6750BAA0",
    },
    {
      name: "- Bui Nguyen Ngoc Anh, Sinh vien Dai hoc FPT",
      feedback:
        "I appreciate how the platform allows me to track my progress over time. Seeing my improvement motivates me to keep practicing.",
      avatar:
        "https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-1/466406916_1108676747446163_704194698712207106_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeF-EOOMObNo6AEdm8WGKMbce2aumpnQf9l7Zq6amdB_2Y1QmcxuTJHwo4dVRHbK6KbrQXWGOWNbK7HZMsg45rXn&_nc_ohc=AqlCW9M8vE4Q7kNvgHXpzIF&_nc_zt=24&_nc_ht=scontent.fhan3-2.fna&_nc_gid=AXGKZmzFgM3uV5pPHbPkqVy&oh=00_AYCfMXjUGmer81emnLzODhxut3givsi4-8C0lhY_6fWwsQ&oe=6750B00A",
    },
    {
      name: "- Nguyen Phuong Nam, Sinh vien Dai hoc FPT",
      feedback:
        "This website is a game changer for essay writing. It helped me write more structured and error-free essays in much less time.",
      avatar:
        "https://scontent.fhan4-4.fna.fbcdn.net/v/t39.30808-1/299366293_597223268459745_5915045627114264668_n.jpg?stp=dst-jpg_s200x200&_nc_cat=102&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeHHyFrw_z6Y-b-tQYOvl0yKocY0wxgnxS6hxjTDGCfFLo0FZ-EYGWibO8pyzX5cN22Z_F_X5TRWPDQUewOcvgYH&_nc_ohc=tCO5Zd8GQeoQ7kNvgG_xDTR&_nc_zt=24&_nc_ht=scontent.fhan4-4.fna&_nc_gid=AD5rPGDzvLCnDAqh0sprhy9&oh=00_AYBUZ5bTqCEVgVDVpXc0UBPehUcCNiX_PxeFMFf3Ey5xog&oe=6750C447",
    },
    {
      name: "- Nguyen Tuan Viet, Sinh vien Dai hoc FPT",
      feedback:
        "The real-time corrections and clear explanations have been invaluable. This platform makes improving my writing both fun and effective!",
      avatar:
        "https://scontent.fhan4-1.fna.fbcdn.net/v/t39.30808-1/461278357_1942512882941779_1675118601958007794_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeGCYeemAA8_13p1LvgsvZ1J4Z0vnzdCnmfhnS-fN0KeZ8QzhxPWoSZKJF52KxxuRNp04nsZy3f8lnOyg_yDl5bh&_nc_ohc=MIjWHunqzr4Q7kNvgGiJrgf&_nc_zt=24&_nc_ht=scontent.fhan4-1.fna&_nc_gid=A5iDbpWHG9kmY18_T4DxxIZ&oh=00_AYBCANh7cBiAyNOyUv0ragTvAgHEgZY4rstGUSH7Qx_sAw&oe=6750BF39",
    },
  ];

  const profile = useSelector((state) => state.auth.user);
  const user = profile?.role;
  const handleClick = () => {
    if (user === "student") {
      navigate("/student/dashboard"); // Trang cho sinh viên
    } else if (user === "teacher") {
      navigate("/teacher/dashboard"); // Trang cho giáo viên (hoặc trang tương ứng)
    } else if (user === "admin") {
      navigate("/admin/dashboard"); // Trang mặc định nếu không có vai trò phù hợp
    } else if (user === "referee") {
      navigate("/referee/report");
    } else {
      navigate("/login"); // Trang mặc định nếu không có vai trò phù hợp
      toast.error("Please login to continue!");
    }
  };

  return (
    <Box
      sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "30px" }}
    >
      {/* Hero Section */}
      <Paper
  elevation={3}
  sx={{
    display: "flex",
    flexDirection: { xs: "column", md: "row" }, // Chuyển từ cột sang hàng trên màn hình lớn
    alignItems: "center",
    justifyContent: "space-between",
    padding: { xs: "20px", md: "40px" }, // Padding nhỏ hơn trên màn hình nhỏ
    marginBottom: "40px",
    backgroundColor: "#eef3fc",
  }}
>
  <Box sx={{ maxWidth: { xs: "100%", md: "50%" }, textAlign: { xs: "center", md: "left" } }}>
    <Typography variant="h3" sx={{ fontWeight: "bold", color: "#333" }}>
      Automated Essay Scoring
    </Typography>
    <Typography
      variant="body1"
      sx={{
        margin: "20px 0",
        color: "#555",
        lineHeight: "1.6",
        fontSize: { xs: "1rem", md: "1.125rem" }, // Giảm kích thước font trên màn hình nhỏ
      }}
    >
      Write smarter, not harder. Powered by AI, our system evaluates and provides feedback for your essays instantly.
    </Typography>
    <Button
      variant="contained"
      color="primary"
      sx={{
        padding: "10px 20px",
        borderRadius: "30px",
        fontSize: { xs: "0.875rem", md: "1rem" }, // Giảm kích thước font trên màn hình nhỏ
      }}
      onClick={handleClick}
    >
      Get Started
    </Button>
  </Box>
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      flexGrow: 1,
      marginTop: { xs: "20px", md: "0" }, // Thêm margin-top cho layout trên màn hình nhỏ
    }}
  >
    <img
      src="https://th.bing.com/th/id/OIP.JvLsDNvZnm-PmhXvRrEcOwHaE7"
      alt="Hero"
      style={{
        width: "100%",
        maxWidth: "400px",
        height: "auto",
        borderRadius: "10px",
      }}
    />
  </Box>
  
</Paper>


      {/* Carousel Section */}
      <Carousel>
        {carouselItems.map((item, index) => (
          <Paper
            key={index}
            sx={{
              padding: "20px",
              textAlign: "center",
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
            }}
          >
            {item.text}
          </Paper>
        ))}
      </Carousel>

      {/* Features Section */}
      <Box sx={{ margin: "50px 0" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", marginBottom: "30px" }}
        >
          Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card elevation={3} sx={{ textAlign: "center", padding: "20px" }}>
                <img
                  src={feature.icon}
                  alt={feature.title}
                  style={{ width: "80px", marginBottom: "20px" }}
                />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: "10px" }}>
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ margin: "50px 0" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", marginBottom: "30px" }}
        >
          What Our Users Say
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "30px",
                }}
              >
                <Avatar
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  sx={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 20px",
                  }}
                />
                <Typography variant="body2">{testimonial.feedback}</Typography>
                <Typography
                  variant="h6"
                  sx={{ marginTop: "10px", fontWeight: "bold" }}
                >
                  {testimonial.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;

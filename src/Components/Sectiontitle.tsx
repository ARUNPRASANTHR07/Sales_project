import { Typography } from "@mui/material";


interface SectionTitleProps {
  title: string;
}

const Sectiontitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
        <Typography variant="h6"sx={{ fontWeight: 'bold',display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '5vh' }}>
            {title}
        </Typography>
    );  
};

export default Sectiontitle;
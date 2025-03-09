import { CiSettings } from "react-icons/ci";
import styled from "styled-components";

// styled-components just for training

const Header = styled.header`
  display: flex;
  flex-direction: column;
  padding: 5px;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`;

const NotificationsTitle = styled.span`
  font-size: 1.25rem;
`;

const HeaderBottom = styled(HeaderTop)`
  color: blue;
`;

const Notifications = () => {
  return (
    <Header>
      <HeaderTop>
        <NotificationsTitle>Notifications</NotificationsTitle>
        <CiSettings />
      </HeaderTop>
      <HeaderBottom>balls</HeaderBottom>
    </Header>
  );
};

export default Notifications;

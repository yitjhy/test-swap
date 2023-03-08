import { FC, ReactNode } from 'react';
import styled from 'styled-components';

const Header: FC<{ title: ReactNode; operation?: ReactNode }> = ({
  title,
  operation,
}) => {
  return (
    <HeaderWrapper>
      <span className="header-title">{title}</span>
      <>{!!operation && operation}</>
    </HeaderWrapper>
  );
};
const HeaderWrapper = styled.div`
  padding: 8px 12px 0;
  margin-bottom: 8px;
  color: #7780a0;
  display: flex;
  justify-content: space-between;
  .header-title {
    font-weight: bolder;
    font-size: 20px;
    color: #d9d9d9;
  }
`;
export default Header;

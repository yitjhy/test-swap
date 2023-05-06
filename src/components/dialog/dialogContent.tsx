import React, { FC } from 'react'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { DialogType } from '@/components/dialog/index'
// import { Images } from '@/utils/images'
// import { Image } from '@/views/common/Image'

const DialogContent: FC<{ title: string; desc: string | React.ReactNode; type: DialogType; onClose: () => void }> = ({
  title,
  desc,
  type = true,
  onClose,
}) => {
  return (
    <DialogContentWrapper>
      {type === DialogType.loading && (
        <div className="icon-wrapper">
          <img src="/images/common/runfid.gif" style={{ width: 100, height: 100 }} />
          {/*<LoadingOutlined style={{ fontSize: 95 }} />*/}
        </div>
      )}
      {type === DialogType.success && (
        <div className="icon-wrapper">
          <img src="/images/common/success.svg" style={{ width: 100, height: 100 }} />
          {/*<CheckCircleOutlined style={{ fontSize: 80 }} />*/}
          {/*<Image src="/images/common/success.svg" />*/}
          {/*<Image src={Images.COMMON.DIALOG_SUCCESS_SVG} />*/}
        </div>
      )}
      {type === DialogType.warn && (
        <div className="icon-wrapper">
          <img src="/images/common/warn.svg" style={{ width: 100, height: 100 }} />
          {/*<CloseCircleOutlined style={{ fontSize: 80 }} />*/}
          {/*<Image src={Images.COMMON.DIALOG_FAIL_SVG} />*/}
        </div>
      )}
      <div className="title">{title}</div>
      <div className="desc">{desc}</div>
      {type !== DialogType.loading && (
        <>
          {type === DialogType.warn ? (
            <div
              className="btn"
              onClick={() => {
                onClose()
              }}
            >
              Close
            </div>
          ) : (
            <div
              className="btn"
              onClick={() => {
                onClose()
              }}
            >
              Close
            </div>
          )}
        </>
      )}
    </DialogContentWrapper>
  )
}
const DialogContentWrapper = styled.div`
  display: grid;
  padding-bottom: 60px;
  .title {
    display: flex;
    justify-content: center;
    font-size: 26px;
    color: #d9d9d9;
    margin-top: 36px;
    font-weight: bolder;
  }
  .desc {
    display: flex;
    justify-content: center;
    font-size: 12px;
    margin-top: 19px;
    color: #b9b9b9;
  }
  .icon-wrapper {
    width: 88.06px;
    height: 88.06px;
    display: flex;
    justify-content: center;
    margin: 28px auto 0;
    img {
      width: 100%;
    }
  }
  .btn {
    width: 227px;
    height: 33px;
    margin: 38px auto 0;
    background: #bfff37;
    font-size: 16px;
    color: #0c0c0c;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
export default DialogContent

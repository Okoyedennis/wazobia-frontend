import React, { FC, forwardRef, useImperativeHandle, useState } from "react";

interface Pros {
  onConfirmed: any;
  ref: any;
}

const Delete: FC<Pros> = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    showDeleteModal() {
      setShow(true);
    },
  }));

  const deleteProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onConfirmed();
    setShow(false);
  };

  return (
    <>
      {show && (
        <div className="model delete">
          <div className=" contain">
            <form>
              <div className="modal-header">
                <h5 className="modal-title">
                  Are you sure you want to delete selected event?
                </h5>
              </div>
              <hr />
              <div className="model-footer">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="event"
                  // @ts-ignore
                  onClick={(e) => deleteProduct(e)}
                >
                  I'm sure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
});

export default Delete;

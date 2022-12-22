import Checkbox from "../../../../primitives/Checkbox";

type Props = {
  type: string;
  filters: any;
  setFilter: any;
};

const Filter = (props: Props) => {
  return (
    <>
      {props.filters.isBirthday !== true && (
        <div className="flex justify-end items-center gap-2">
          <label>Hide Birthdays</label>
          <Checkbox
            checked={props.filters.isBirthday === false}
            onChecked={(checked) => {
              if (checked) {
                props.setFilter((state: any) => ({
                  ...state,
                  isBirthday: false,
                }));
              } else {
                props.setFilter((state: any) => ({
                  ...state,
                  isBirthday: undefined,
                }));
              }
            }}
            ariaLabel={`Hide Birthdays`}
          />
        </div>
      )}
      {props.filters.isBirthday !== false && (
        <div className="flex justify-end items-center gap-2">
          <label>Show Birthdays Only</label>
          <Checkbox
            checked={props.filters.isBirthday === true}
            onChecked={(checked) => {
              if (checked) {
                props.setFilter((state: any) => ({
                  ...state,
                  isBirthday: true,
                }));
              } else {
                props.setFilter((state: any) => ({
                  ...state,
                  isBirthday: undefined,
                }));
              }
            }}
            ariaLabel={`Show Birthdays Only`}
          />
        </div>
      )}
    </>
  );
};

export default Filter;

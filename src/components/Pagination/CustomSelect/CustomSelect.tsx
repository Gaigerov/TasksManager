// import {useState, useEffect, useRef, FC} from 'react';
// import chevronDown from "../../image/ChevronDown.svg";
// import {tasksActions} from '../../redux/tasksStore';
// import {useAppDispatch} from '../../hooks';

// type Props = {
//     options: number[];
//     value: number;
// }

// export const CustomSelect: FC<Props> = ({options, value}) => {
//     const dispatch = useAppDispatch();
//     const [isOpen, setIsOpen] = useState<boolean>(false);
//     const selectRef = useRef<HTMLDivElement | null>(null);

//     const handleOptionClick = (option: number) => {
//         dispatch(tasksActions.setTasksPerPage(option));
//         setIsOpen(false);
//     };

//     const handleClickOutside = (event: MouseEvent) => {
//         if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
//             setIsOpen(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     return (
//         <div className="customSelect" ref={selectRef}>
//             <div className="customSelect__trigger" onClick={() => setIsOpen(!isOpen)}>
//                 {value}
//                 <img src={chevronDown} alt="chevronDown" />
//             </div>
//             {isOpen && (
//                 <ul className="customSelect__customOptions">
//                     {options.map((option) => (
//                         <li
//                             key={option}
//                             onClick={() => handleOptionClick(option)}
//                         >
//                             {option}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

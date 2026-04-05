import * as LiaIcons from "react-icons/lia";

type LiaIconName = keyof typeof LiaIcons;

interface IconMapperProps {
  name: string;
}

function IconMapper({ name }: IconMapperProps) {
  const IconComponent = LiaIcons[name as LiaIconName];

  if (!IconComponent) {
    return <span>Icon not found</span>;
  }

  return <IconComponent />;
}

export default IconMapper;

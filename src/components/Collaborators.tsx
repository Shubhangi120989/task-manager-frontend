import { Button, User } from '@nextui-org/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Project } from '../types/project';
import { deleteRole } from '../apis/project';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Spinner
  } from "@nextui-org/react";
import { toast } from 'sonner';
import { Role } from '../types/role';
// import { set } from 'lodash';
import { updateProjectRoles } from '../redux/projectSlice';





import { useDispatch } from 'react-redux';
import { Action, hasPermission, RoleType } from '../types/projectPermissions';
import { useParams } from 'react-router-dom';


const Collaborators: React.FC = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const roleType: RoleType = params.role as RoleType;
    const currentProject = useSelector((state: { project: { currentProject: Project } }) => state.project.currentProject);
    const [roles, setRoles] = useState<Role[]>(currentProject.roles || []);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [roleId,setRoleId]=useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleDeleteRole2 = async () => {
        console.log(roleId)
        try {
            setLoading(()=>true);
            await deleteRole(roleId);
            onOpenChange();
            const updatedRoles = roles.filter((role) => role.id !== roleId);
            setRoles(updatedRoles);
            dispatch(updateProjectRoles(updatedRoles));
            // dispatch(setProjectRoles(updatedRoles));
            setLoading(()=>false);
            toast.success("Collaborator removed successfully.");
        } catch (error) {
            console.error("Error deleting role:", error)
        }
        
    };

    const handleDeleteRole1=(roleId:string)=>{
        onOpen();
        setRoleId(()=>roleId);
    }
    return (
        <div>
            <div className='grid lg:grid-cols-2 gap-4 p-3 sm:grid-cols-1  border-gray-700'>
            {roles?.map((role) => (
                <div key={role.id} className={`flex justify-evenly gap-9 p-3 hover:bg-gray-900 border-b border-gray-700 pb-6`}>
                <User
                    avatarProps={{
                    src: role.user.avatarUrl,
                    }}
                    description={
                    <div>
                        {role.user.username}
                    </div>
                    }
                    name={role.user.name}
                />
                <div className='text-small border px-2 pt-2'>{role.role}</div>
                {hasPermission("Role",roleType,Action.DELETE)&&<Button color='danger' size='sm' onPress={()=>handleDeleteRole1(role.id)}>Remove</Button>}
                </div>
            ))}
            </div>

            <Modal
        backdrop="opaque"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm</ModalHeader>
              <ModalBody>
                <p>
                 Are you sure, you want to remove this collaborator?
                </p>
               
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                
                  {loading?<Spinner/>:<Button color="primary" onPress={()=>handleDeleteRole2()}> Remove</Button>}
               
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        </div>
    );
};

export default Collaborators;

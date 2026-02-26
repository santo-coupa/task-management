namespace task_management_backend.Attributes;

[AttributeUsage(AttributeTargets.Method)]
public class CanOnlyBePerformedByAdminAttribute : Attribute
{

}

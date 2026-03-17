
export function parseValidationErrors<T>(field: any) {
    if (field.state.meta.errors.length > 0) {
        return (
            <div className="text-sm text-red-500 space-y-1">
                {field.state.meta.errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-1">
                        <span>•</span>
                        <span>{error?.message}</span>
                    </div>
                ))}
            </div>
        )
    }


}
export default function ErrorMessage({ message }: { message: null | string }) {
    return (
        <div style={{ height: "20px" }}>
            {message !== null &&
                <p style={{ color: "red", fontSize: "18px", margin: "0" }}>{message}</p>
            }
        </div>
    )
}